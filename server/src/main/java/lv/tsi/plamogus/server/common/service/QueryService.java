package lv.tsi.plamogus.server.common.service;

import lombok.NonNull;

import java.util.List;

public interface QueryService<T, Q> {

    List<T> findAll(@NonNull Q query);

}
