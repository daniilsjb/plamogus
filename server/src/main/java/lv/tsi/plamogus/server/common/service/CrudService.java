package lv.tsi.plamogus.server.common.service;

import lombok.NonNull;

import java.util.List;

public interface CrudService<T, ID> {

    List<T> findAll();

    T create(@NonNull T entity);

    T findOne(@NonNull ID id);

    T update(@NonNull T entity);

    void delete(@NonNull ID id);

}
