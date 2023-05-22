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
@RequestMapping
class StepController {

    private final StepService service;
    private final StepConverter converter;

    @PostMapping("/assignments/{assignmentId}/steps")
    @ResponseStatus(HttpStatus.CREATED)
    public StepResponse create(@PathVariable UUID assignmentId, @Valid @RequestBody StepRequest request) {
        var entity = converter.toEntity(request);
        entity.setAssignment(new Assignment(assignmentId));
        return converter.toResponse(service.create(entity));
    }

    @GetMapping("/assignments/{assignmentId}/steps")
    public List<StepResponse> findAll(@PathVariable UUID assignmentId) {
        return service.findAll(new StepQuery(assignmentId)).stream()
            .map(converter::toResponse)
            .toList();
    }

    @PutMapping("/steps/{id}")
    public StepResponse update(@PathVariable UUID id, @Valid @RequestBody StepRequest request) {
        var entity = converter.toEntity(request);
        entity.setId(id);
        return converter.toResponse(service.update(entity));
    }

    @DeleteMapping("/steps/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PutMapping("/steps/{id}/completion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void complete(@PathVariable UUID id) {
        service.complete(id);
    }

    @DeleteMapping("/steps/{id}/completion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void uncomplete(@PathVariable UUID id) {
        service.uncomplete(id);
    }

}
