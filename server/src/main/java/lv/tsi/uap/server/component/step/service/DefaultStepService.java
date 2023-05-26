package lv.tsi.uap.server.component.step.service;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lv.tsi.uap.server.component.assignment.service.AssignmentRepository;
import lv.tsi.uap.server.common.service.AbstractCrudService;
import lv.tsi.uap.server.component.step.endpoint.StepQuery;
import lv.tsi.uap.server.component.user.service.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@Service
class DefaultStepService extends AbstractCrudService<Step, UUID, StepRepository> implements StepService {

    private final AssignmentRepository assignmentRepository;
    private final Supplier<User> userSupplier;

    public DefaultStepService(StepRepository repository, AssignmentRepository assignmentRepository, Supplier<User> userSupplier) {
        super(repository);
        this.assignmentRepository = assignmentRepository;
        this.userSupplier = userSupplier;
    }

    @Override
    public Step create(@NonNull Step entity) {
        final var user = userSupplier.get();

        var assignmentId = entity.getAssignment().getId();
        if (!assignmentRepository.existsByIdAndProfileId(assignmentId, user.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var nextIndex = repository.findLastIndex(assignmentId)
            .map(previous -> previous + 1)
            .orElse(0);

        entity.setId(UUID.randomUUID());
        entity.setIndex(nextIndex);
        return repository.save(entity);
    }

    @Override
    public List<Step> findAll(@NonNull StepQuery query) {
        final var user = userSupplier.get();
        if (!assignmentRepository.existsByIdAndProfileId(query.getAssignmentId(), user.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return repository.findByAssignmentIdOrderByIndex(query.getAssignmentId());
    }

    @Override
    public Step update(@NonNull Step entity) {
        final var user = userSupplier.get();

        var existingEntity = repository.findById(entity.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!entity.getAssignment().getProfile().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        existingEntity.setTitle(entity.getTitle());
        return repository.save(existingEntity);
    }

    @Override
    @Transactional
    public void delete(@NonNull UUID id) {
        final var user = userSupplier.get();

        repository.findById(id).ifPresent(entity -> {
            var assignmentId = entity.getAssignment().getId();
            if (!assignmentRepository.existsByIdAndProfileId(assignmentId, user.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN);
            }

            repository.deleteById(id);
            repository.updateIndices(assignmentId, entity.getIndex());
        });
    }

    @Override
    public void complete(@NonNull UUID id) {
        final var user = userSupplier.get();

        var existingEntity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!existingEntity.getAssignment().getProfile().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        existingEntity.setCompleted(true);
        repository.save(existingEntity);
    }

    @Override
    public void uncomplete(@NonNull UUID id) {
        final var user = userSupplier.get();

        var existingEntity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!existingEntity.getAssignment().getProfile().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        existingEntity.setCompleted(false);
        repository.save(existingEntity);
    }

}
