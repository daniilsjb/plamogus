package lv.tsi.uap.server.component.assignment.service;

import lombok.NonNull;
import lv.tsi.uap.server.common.service.AbstractCrudService;
import lv.tsi.uap.server.component.assignment.endpoint.AssignmentQuery;
import lv.tsi.uap.server.component.course.service.CourseRepository;
import lv.tsi.uap.server.component.user.service.User;
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
    private final Supplier<User> userSupplier;

    public DefaultAssignmentService(AssignmentRepository repository, CourseRepository courseRepository, Supplier<User> userSupplier) {
        super(repository);
        this.courseRepository = courseRepository;
        this.userSupplier = userSupplier;
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

    private static Specification<Assignment> hasUser(UUID id) {
        return (root, query, builder) ->
            builder.equal(root.get("profile").get("id"), id);
    }

    @Override
    public Assignment create(@NonNull Assignment entity) {
        final var user = userSupplier.get();

        if (entity.getCourse() != null) {
            var courseId = entity.getCourse().getId();
            if (!courseRepository.existsByIdAndProfileId(courseId, user.getId())) {
                throw new NoSuchElementException("Course '%s' does not exist".formatted(courseId));
            }
        }

        entity.setId(UUID.randomUUID());
        entity.setCreationTime(Instant.now());
        entity.setProfile(user);

        return repository.save(entity);
    }

    @Override
    public List<Assignment> findAll(@NonNull AssignmentQuery query) {
        final var user = userSupplier.get();

        var direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(query.getOrder())) {
            direction = Sort.Direction.DESC;
        }

        var sort = Sort.by(direction, query.getOrderBy());
        var specification = where(hasUser(user.getId()))
            .and(hasTitleContaining(query.getTitle()))
            .and(hasCourse(query.getCourse()))
            .and(hasType(query.getType()));

        return repository.findAll(specification, sort);
    }

    @Override
    public Assignment findOne(@NonNull UUID id) {
        final var user = userSupplier.get();
        return repository.findByIdAndProfileId(id, user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public Assignment update(@NonNull Assignment entity) {
        final var user = userSupplier.get();

        if (entity.getCourse() != null) {
            var courseId = entity.getCourse().getId();
            if (!courseRepository.existsByIdAndProfileId(courseId, user.getId())) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        }

        var existingEntity = repository.findById(entity.getId());
        existingEntity.ifPresentOrElse(
            it -> {
                entity.setCreationTime(it.getCreationTime());
                entity.setCompleted(it.getCompleted());
                entity.setProfile(it.getProfile());
            },
            () -> {
                entity.setCreationTime(Instant.now());
                entity.setCompleted(false);
                entity.setProfile(user);
            }
        );

        return repository.save(entity);
    }

    @Override
    public void delete(@NonNull UUID id) {
        final var user = userSupplier.get();
        if (repository.existsByIdAndProfileId(id, user.getId())) {
            super.delete(id);
        }
    }

    @Override
    public void complete(@NonNull UUID id) {
        final var user = userSupplier.get();
        var entity = repository.findByIdAndProfileId(id, user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        entity.setCompleted(true);
        repository.save(entity);
    }

    @Override
    public void uncomplete(@NonNull UUID id) {
        final var user = userSupplier.get();
        var entity = repository.findByIdAndProfileId(id, user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        entity.setCompleted(false);
        repository.save(entity);
    }

}
