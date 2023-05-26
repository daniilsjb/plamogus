package lv.tsi.uap.server.component.course.service;

import lombok.NonNull;
import lv.tsi.uap.server.common.service.AbstractCrudService;
import lv.tsi.uap.server.component.course.endpoint.CourseQuery;
import lv.tsi.uap.server.component.user.service.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

import static org.springframework.data.jpa.domain.Specification.where;

@Service
class DefaultCourseService extends AbstractCrudService<Course, UUID, CourseRepository> implements CourseService {

    private final Supplier<User> userSupplier;

    public DefaultCourseService(CourseRepository repository, Supplier<User> userSupplier) {
        super(repository);
        this.userSupplier = userSupplier;
    }

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

    private static Specification<Course> hasUser(UUID id) {
        return (root, query, builder) ->
            builder.equal(root.get("profile").get("id"), id);
    }

    @Override
    public Course create(@NonNull Course entity) {
        final var user = userSupplier.get();
        entity.setId(UUID.randomUUID());
        entity.setProfile(user);
        return repository.save(entity);
    }

    @Override
    public List<Course> findAll(@NonNull CourseQuery query) {
        final var user = userSupplier.get();

        var direction = Sort.Direction.ASC;
        if ("desc".equalsIgnoreCase(query.getOrder())) {
            direction = Sort.Direction.DESC;
        }

        var sort = Sort.by(direction, query.getOrderBy());
        var specification = where(hasUser(user.getId()))
            .and(hasSimilarTitleOrCode(query.getSearch()));

        return repository.findAll(specification, sort);
    }

    @Override
    public Course findOne(@NonNull UUID id) {
        final var user = userSupplier.get();
        return repository.findByIdAndProfileId(id, user.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public Course update(@NonNull Course entity) {
        final var user = userSupplier.get();

        var existingEntity = repository.findById(entity.getId());
        existingEntity.ifPresentOrElse(
            it -> entity.setProfile(it.getProfile()),
            () -> entity.setProfile(user)
        );

        return super.update(entity);
    }

    @Override
    public void delete(@NonNull UUID id) {
        final var user = userSupplier.get();
        if (repository.existsByIdAndProfileId(id, user.getId())) {
            super.delete(id);
        }
    }

}
