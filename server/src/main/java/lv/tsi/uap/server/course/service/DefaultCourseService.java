package lv.tsi.uap.server.course.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.course.endpoint.CourseQuery;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
@RequiredArgsConstructor
class DefaultCourseService implements CourseService {

    private final CourseRepository courses;

    private static Specification<Course> hasSimilarTitleOrCode(String search) {
        return (root, query, builder) -> {
            if (search == null) {
                return builder.conjunction();
            }

            var searchIgnoringCase = search.toLowerCase();
            return builder.or(
                builder.like(builder.lower(root.get("code")), "%" + searchIgnoringCase + "%"),
                builder.like(builder.lower(root.get("title")), "%" + searchIgnoringCase + "%")
            );
        };
    }

    @Override
    public Course create(@NonNull Course entity) {
        entity.setId(UUID.randomUUID());
        return courses.save(entity);
    }

    @Override
    public List<Course> findAll(CourseQuery query) {
        var direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(query.getOrder())) {
            direction = Sort.Direction.DESC;
        }

        var sort = Sort.by(direction, query.getOrderBy());
        var specification = where(hasSimilarTitleOrCode(query.getSearch()));

        return courses.findAll(specification, sort);
    }

    @Override
    public Course findOne(@NonNull UUID id) {
        return courses.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public Course update(@NonNull Course entity) {
        return courses.save(entity);
    }

    @Override
    public void delete(@NonNull UUID id) {
        courses.deleteById(id);
    }

}
