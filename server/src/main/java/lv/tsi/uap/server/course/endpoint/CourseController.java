package lv.tsi.uap.server.course.endpoint;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lv.tsi.uap.server.course.service.CourseService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/courses")
class CourseController {

    private final CourseService service;
    private final CourseConverter converter;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse create(@Valid @RequestBody CourseRequest request) {
        var entity = converter.toEntity(request);
        return converter.toResponse(service.create(entity));
    }

    @GetMapping
    public List<CourseResponse> findAll(CourseQuery query) {
        return service.findAll(query).stream()
            .map(converter::toResponse)
            .toList();
    }

    @GetMapping("/{id}")
    public CourseResponse findOne(@PathVariable UUID id) {
        return converter.toResponse(service.findOne(id));
    }

    @PutMapping("/{id}")
    public CourseResponse update(@PathVariable UUID id, @Valid @RequestBody CourseRequest request) {
        var entity = converter.toEntity(request);
        entity.setId(id);
        return converter.toResponse(service.update(entity));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }

}
