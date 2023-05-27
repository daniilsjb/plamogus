package lv.tsi.uap.server.component.assignment.service;

import lombok.NonNull;
import lv.tsi.uap.server.common.service.AbstractCrudService;
import lv.tsi.uap.server.component.assignment.endpoint.AssignmentQuery;
import lv.tsi.uap.server.component.course.service.CourseRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.function.Supplier;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
class DefaultAssignmentService extends AbstractCrudService<Assignment, UUID, AssignmentRepository> implements AssignmentService {

    private final CourseRepository courseRepository;
    private final Supplier<UUID> uuidSupplier;
    private final Supplier<Instant> instantSupplier;

    public DefaultAssignmentService(
        AssignmentRepository repository,
        CourseRepository courseRepository,
        Supplier<UUID> uuidSupplier,
        Supplier<Instant> instantSupplier
    ) {
        super(repository);
        this.courseRepository = courseRepository;
        this.uuidSupplier = uuidSupplier;
        this.instantSupplier = instantSupplier;
    }

    private static Specification<Assignment> hasType(AssignmentType type) {
        return (root, query, builder) -> (type == null)
            ? builder.conjunction()
            : builder.equal(root.get("type"), type);
    }

    private static Specification<Assignment> hasCourse(String courseCode) {
        return (root, query, builder) -> (courseCode == null)
            ? builder.conjunction()
            : builder.equal(root.get("course").get("code"), courseCode);
    }

    private static Specification<Assignment> hasTitleContaining(String title) {
        return (root, query, builder) -> (title == null)
            ? builder.conjunction()
            : builder.like(builder.lower(root.get("title")), "%" + title.toLowerCase() + "%");
    }

    @Override
    public Assignment create(@NonNull Assignment entity) {
        if (entity.getCourse() != null) {
            final var courseId = entity.getCourse().getId();
            if (!courseRepository.existsById(courseId)) {
                throw new NoSuchElementException("Course '%s' does not exist".formatted(courseId));
            }
        }

        entity.setId(uuidSupplier.get());
        entity.setCreationTime(instantSupplier.get());
        return repository.save(entity);
    }

    @Override
    public List<Assignment> findAll(@NonNull AssignmentQuery query) {
        var direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(query.getOrder())) {
            direction = Sort.Direction.DESC;
        }

        final var sort = Sort.by(direction, query.getOrderBy());
        final var specification = where(hasTitleContaining(query.getTitle()))
            .and(hasCourse(query.getCourse()))
            .and(hasType(query.getType()));

        return repository.findAll(specification, sort);
    }

    @Override
    public Assignment update(@NonNull Assignment entity) {
        if (entity.getCourse() != null) {
            var courseId = entity.getCourse().getId();
            if (!courseRepository.existsById(courseId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        }

        final var existingEntity = repository.findById(entity.getId());
        existingEntity.ifPresentOrElse(
            it -> {
                entity.setCreationTime(it.getCreationTime());
                entity.setCompleted(it.getCompleted());
            },
            () -> {
                entity.setCreationTime(instantSupplier.get());
                entity.setCompleted(false);
            }
        );

        return repository.save(entity);
    }

    @Override
    public void complete(@NonNull UUID id) {
        var entity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        entity.setCompleted(true);
        repository.save(entity);
    }

    @Override
    public void uncomplete(@NonNull UUID id) {
        var entity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        entity.setCompleted(false);
        repository.save(entity);
    }

}
