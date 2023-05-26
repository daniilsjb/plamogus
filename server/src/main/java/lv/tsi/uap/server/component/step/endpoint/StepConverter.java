package lv.tsi.uap.server.component.step.endpoint;

import lombok.NonNull;
import lv.tsi.uap.server.component.step.service.Step;
import org.springframework.stereotype.Component;

@Component
class StepConverter {

    public Step toEntity(@NonNull StepRequest request) {
        var entity = new Step();
        entity.setTitle(request.getTitle());
        return entity;
    }

    public StepResponse toResponse(@NonNull Step entity) {
        return StepResponse.builder()
            .id(entity.getId())
            .title(entity.getTitle())
            .completed(entity.getCompleted())
            .build();
    }

}
