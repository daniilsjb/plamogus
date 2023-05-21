package lv.tsi.uap.server.assignment.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.assignment.endpoint.AssignmentQuery;
import lv.tsi.uap.server.course.service.CourseRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
@RequiredArgsConstructor
class DefaultAssignmentService implements AssignmentService {

    private final AssignmentRepository assignments;
    private final CourseRepository courses;

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
            var courseId = entity.getCourse().getId();
            if (!courses.existsById(courseId)) {
                throw new NoSuchElementException("Course '%s' does not exist".formatted(courseId));
            }
        }

        entity.setId(UUID.randomUUID());
        entity.setCreationTime(Instant.now());
        return assignments.save(entity);
    }

    @Override
    public List<Assignment> findAll(AssignmentQuery query) {
        var direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(query.getOrder())) {
            direction = Sort.Direction.DESC;
        }

        var sort = Sort.by(direction, query.getOrderBy());
        var specification = where(hasType(query.getType()))
            .and(hasCourse(query.getCourse()))
            .and(hasTitleContaining(query.getTitle()));

        return assignments.findAll(specification, sort);
    }

    @Override
    public Assignment findOne(@NonNull UUID id) {
        return assignments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public Assignment update(@NonNull Assignment entity) {
        if (entity.getCourse() != null) {
            var courseId = entity.getCourse().getId();
            if (!courses.existsById(courseId)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        }

        var existingEntity = assignments.findById(entity.getId());
        existingEntity.ifPresentOrElse(
            it -> {
                entity.setCreationTime(it.getCreationTime());
                entity.setCompleted(it.getCompleted());
            },
            () -> {
                entity.setCreationTime(Instant.now());
                entity.setCompleted(false);
            }
        );

        return assignments.save(entity);
    }

    @Override
    public void delete(@NonNull UUID id) {
        assignments.deleteById(id);
    }

    @Override
    public void complete(@NonNull UUID id) {
        var entity = assignments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        entity.setCompleted(true);
        assignments.save(entity);
    }

    @Override
    public void uncomplete(@NonNull UUID id) {
        var entity = assignments.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        entity.setCompleted(false);
        assignments.save(entity);
    }

}
