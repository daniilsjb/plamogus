package lv.tsi.uap.server.step.service;

import jakarta.transaction.Transactional;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.assignment.service.AssignmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
class DefaultStepService implements StepService {

    private final StepRepository steps;
    private final AssignmentRepository assignments;

    @Override
    public Step create(@NonNull Step entity) {
        var assignmentId = entity.getAssignment().getId();
        if (!assignments.existsById(assignmentId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        var nextIndex = steps.findLastIndex(entity.getAssignment().getId())
            .map(it -> it + 1)
            .orElse(0);

        entity.setIndex(nextIndex);
        return steps.save(entity);
    }

    @Override
    public List<Step> findAll(@NonNull UUID assignmentId) {
        return steps.findByAssignmentIdOrderByIndex(assignmentId);
    }

    @Override
    public Step update(@NonNull Step entity) {
        var assignmentId = entity.getAssignment().getId();
        var index = entity.getIndex();
        var existingEntity = steps.findByAssignmentIdAndIndex(assignmentId, index)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setTitle(entity.getTitle());
        return steps.save(existingEntity);
    }

    @Override
    @Transactional
    public void delete(@NonNull UUID assignmentId, @NonNull Integer index) {
        steps.deleteByAssignmentIdAndIndex(assignmentId, index);
        steps.updateIndices(assignmentId, index);
    }

    @Override
    public void complete(@NonNull UUID assignmentId, @NonNull Integer index) {
        var existingEntity = steps.findByAssignmentIdAndIndex(assignmentId, index)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setCompleted(true);
        steps.save(existingEntity);
    }

    @Override
    public void uncomplete(@NonNull UUID assignmentId, @NonNull Integer index) {
        var existingEntity = steps.findByAssignmentIdAndIndex(assignmentId, index)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        existingEntity.setCompleted(false);
        steps.save(existingEntity);
    }

}
