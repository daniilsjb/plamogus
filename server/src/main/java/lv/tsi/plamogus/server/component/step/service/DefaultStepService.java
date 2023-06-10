package lv.tsi.plamogus.server.component.step.service;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lv.tsi.plamogus.server.common.service.AbstractCrudService;
import lv.tsi.plamogus.server.component.assignment.service.AssignmentRepository;
import lv.tsi.plamogus.server.component.step.endpoint.StepQuery;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;
import java.util.function.Supplier;

@Service
class DefaultStepService extends AbstractCrudService<Step, UUID, StepRepository> implements StepService {

    private final AssignmentRepository assignmentRepository;
    private final Supplier<UUID> uuidSupplier;

    public DefaultStepService(StepRepository repository, AssignmentRepository assignmentRepository, Supplier<UUID> uuidSupplier) {
        super(repository);
        this.assignmentRepository = assignmentRepository;
        this.uuidSupplier = uuidSupplier;
    }

    @Override
    public Step create(@NonNull Step entity) {
        final var assignmentId = entity.getAssignment().getId();
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        final var nextIndex = repository.findLastIndex(assignmentId)
            .map(previous -> previous + 1)
            .orElse(0);

        entity.setId(uuidSupplier.get());
        entity.setIndex(nextIndex);
        entity.setCompleted(false);
        return repository.save(entity);
    }

    @Override
    public List<Step> findAll(@NonNull StepQuery query) {
        if (!assignmentRepository.existsById(query.getAssignmentId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return repository.findByAssignmentIdOrderByIndex(query.getAssignmentId());
    }

    @Override
    public Step update(@NonNull Step entity) {
        var existingEntity = repository.findById(entity.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setTitle(entity.getTitle());
        return repository.save(existingEntity);
    }

    @Override
    @Transactional
    public void delete(@NonNull UUID id) {
        repository.findById(id).ifPresent(entity -> {
            final var assignmentId = entity.getAssignment().getId();
            repository.deleteById(id);
            repository.updateIndices(assignmentId, entity.getIndex());
        });
    }

    @Override
    public void complete(@NonNull UUID id) {
        final var existingEntity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setCompleted(true);
        repository.save(existingEntity);
    }

    @Override
    public void uncomplete(@NonNull UUID id) {
        final var existingEntity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setCompleted(false);
        repository.save(existingEntity);
    }

}
