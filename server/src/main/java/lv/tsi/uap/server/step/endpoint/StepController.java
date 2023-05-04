package lv.tsi.uap.server.step.endpoint;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.assignment.service.Assignment;
import lv.tsi.uap.server.step.service.StepService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assignments/{assignmentId}/steps")
class StepController {

    private final StepService service;
    private final StepConverter converter;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StepResponse create(@PathVariable UUID assignmentId, @Valid @RequestBody StepRequest request) {
        var entity = converter.toEntity(request);
        entity.setAssignment(new Assignment(assignmentId));
        return converter.toResponse(service.create(entity));
    }

    @GetMapping
    public List<StepResponse> findAll(@PathVariable UUID assignmentId) {
        return service.findAll(assignmentId).stream()
            .map(converter::toResponse)
            .toList();
    }

    @PutMapping("/{index}")
    public StepResponse update(@PathVariable UUID assignmentId, @PathVariable Integer index, @Valid @RequestBody StepRequest request) {
        var entity = converter.toEntity(request);
        entity.setAssignment(new Assignment(assignmentId));
        entity.setIndex(index);
        return converter.toResponse(service.update(entity));
    }

    @DeleteMapping("/{index}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID assignmentId, @PathVariable Integer index) {
        service.delete(assignmentId, index);
    }

    @PutMapping("/{index}/completion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void complete(@PathVariable UUID assignmentId, @PathVariable Integer index) {
        service.complete(assignmentId, index);
    }

    @DeleteMapping("/{index}/completion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void uncomplete(@PathVariable UUID assignmentId, @PathVariable Integer index) {
        service.uncomplete(assignmentId, index);
    }

}
