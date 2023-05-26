package lv.tsi.uap.server.component.assignment.service;

import lombok.NonNull;
import lv.tsi.uap.server.common.service.CrudService;
import lv.tsi.uap.server.component.assignment.endpoint.AssignmentQuery;
import lv.tsi.uap.server.common.service.QueryService;

import java.util.UUID;

public interface AssignmentService extends CrudService<Assignment, UUID>, QueryService<Assignment, AssignmentQuery> {

    void complete(@NonNull UUID id);

    void uncomplete(@NonNull UUID id);

}
