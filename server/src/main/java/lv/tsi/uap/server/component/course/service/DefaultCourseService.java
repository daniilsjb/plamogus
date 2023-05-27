package lv.tsi.uap.server.component.course.service;

import lombok.NonNull;
import lv.tsi.uap.server.common.service.AbstractCrudService;
import lv.tsi.uap.server.component.course.endpoint.CourseQuery;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
class DefaultCourseService extends AbstractCrudService<Course, UUID, CourseRepository> implements CourseService {

    private final Supplier<UUID> uuidSupplier;

    public DefaultCourseService(CourseRepository repository, Supplier<UUID> uuidSupplier) {
        super(repository);
        this.uuidSupplier = uuidSupplier;
    }

    private static Specification<Course> searching(String search) {
        return (root, query, builder) -> {
            if (search == null) {
                return builder.conjunction();
            }

            final var searchIgnoringCase = search.toLowerCase();
            return builder.or(
                builder.like(builder.lower(root.get("code")), "%" + searchIgnoringCase + "%"),
                builder.like(builder.lower(root.get("title")), "%" + searchIgnoringCase + "%")
            );
        };
    }

    @Override
    public Course create(@NonNull Course entity) {
        entity.setId(uuidSupplier.get());
        return repository.save(entity);
    }

    @Override
    public List<Course> findAll(@NonNull CourseQuery query) {
        var direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(query.getOrder())) {
            direction = Sort.Direction.DESC;
        }

        final var sort = Sort.by(direction, query.getOrderBy());
        final var specification = where(searching(query.getSearch()));

        return repository.findAll(specification, sort);
    }

}