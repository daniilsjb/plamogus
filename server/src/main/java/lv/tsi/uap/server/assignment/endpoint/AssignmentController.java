package lv.tsi.uap.server.assignment.endpoint;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.assignment.service.AssignmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/assignments")
class AssignmentController {

    private final AssignmentService service;
    private final AssignmentConverter converter;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentResponse create(@Valid @RequestBody AssignmentRequest request) {
        var entity = converter.toEntity(request);
        return converter.toResponse(service.create(entity));
    }

    @GetMapping
    public List<AssignmentResponse> findAll() {
        return service.findAll().stream()
            .map(converter::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    public AssignmentResponse findOne(@PathVariable UUID id) {
        return converter.toResponse(service.findOne(id));
    }

    @PutMapping("/{id}")
    public AssignmentResponse update(@PathVariable UUID id, @Valid @RequestBody AssignmentRequest request) {
        var entity = converter.toEntity(request);
        entity.setId(id);
        return converter.toResponse(service.update(entity));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

    @PutMapping("/{id}/completion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void complete(@PathVariable UUID id) {
        service.complete(id);
    }

    @DeleteMapping("/{id}/completion")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void uncomplete(@PathVariable UUID id) {
        service.uncomplete(id);
    }

}
