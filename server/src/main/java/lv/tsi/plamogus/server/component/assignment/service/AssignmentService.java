package lv.tsi.plamogus.server.component.assignment.service;

import lombok.NonNull;
import lv.tsi.plamogus.server.common.service.CrudService;
import lv.tsi.plamogus.server.component.assignment.endpoint.AssignmentQuery;
import lv.tsi.plamogus.server.common.service.QueryService;

import java.util.UUID;

public interface AssignmentService extends CrudService<Assignment, UUID>, QueryService<Assignment, AssignmentQuery> {

    void complete(@NonNull UUID id);

    void uncomplete(@NonNull UUID id);

}
