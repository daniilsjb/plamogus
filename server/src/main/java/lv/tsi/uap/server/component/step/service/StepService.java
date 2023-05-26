package lv.tsi.uap.server.component.step.service;

import lombok.NonNull;
import lv.tsi.uap.server.common.service.CrudService;
import lv.tsi.uap.server.common.service.QueryService;
import lv.tsi.uap.server.component.step.endpoint.StepQuery;

import java.util.UUID;

public interface StepService extends CrudService<Step, UUID>, QueryService<Step, StepQuery> {

    void complete(@NonNull UUID id);

    void uncomplete(@NonNull UUID id);

}
