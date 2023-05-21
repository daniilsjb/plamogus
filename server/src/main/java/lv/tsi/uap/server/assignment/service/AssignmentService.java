package lv.tsi.uap.server.assignment.service;

import lombok.NonNull;
import lv.tsi.uap.server.assignment.endpoint.AssignmentQuery;

import java.util.List;
import java.util.UUID;

public interface AssignmentService {

    Assignment create(@NonNull Assignment entity);

    List<Assignment> findAll(AssignmentQuery query);

    Assignment findOne(@NonNull UUID id);

    Assignment update(@NonNull Assignment entity);

    void delete(@NonNull UUID id);

    void complete(@NonNull UUID id);

    void uncomplete(@NonNull UUID id);

}
