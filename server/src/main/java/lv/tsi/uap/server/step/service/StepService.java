package lv.tsi.uap.server.step.service;

import lombok.NonNull;

import java.util.List;
import java.util.UUID;

public interface StepService {

    Step create(@NonNull Step entity);

    List<Step> findAll(@NonNull UUID assignmentId);

    Step update(@NonNull Step entity);

    void delete(@NonNull UUID assignmentId, @NonNull Integer index);

    void complete(@NonNull UUID assignmentId, @NonNull Integer index);

    void uncomplete(@NonNull UUID assignmentId, @NonNull Integer index);

}
