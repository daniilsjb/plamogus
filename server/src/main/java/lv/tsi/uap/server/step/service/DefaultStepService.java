package lv.tsi.uap.server.step.service;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lv.tsi.uap.server.assignment.service.AssignmentRepository;
import lv.tsi.uap.server.common.service.AbstractCrudService;
import lv.tsi.uap.server.step.endpoint.StepQuery;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
class DefaultStepService extends AbstractCrudService<Step, UUID, StepRepository> implements StepService {

    private final AssignmentRepository assignmentRepository;

    public DefaultStepService(StepRepository repository, AssignmentRepository assignmentRepository) {
        super(repository);
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    public Step create(@NonNull Step entity) {
        var assignmentId = entity.getAssignment().getId();
        if (!assignmentRepository.existsById(assignmentId)) {
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
            var assignmentId = entity.getAssignment().getId();
            repository.deleteById(id);
            repository.updateIndices(assignmentId, entity.getIndex());
        });
    }

    @Override
    public void complete(@NonNull UUID id) {
        var existingEntity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setCompleted(true);
        repository.save(existingEntity);
    }

    @Override
    public void uncomplete(@NonNull UUID id) {
        var existingEntity = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setCompleted(false);
        repository.save(existingEntity);
    }

}
