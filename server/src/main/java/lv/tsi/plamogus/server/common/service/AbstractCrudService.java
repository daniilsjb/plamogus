package lv.tsi.plamogus.server.common.service;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RequiredArgsConstructor
public abstract class AbstractCrudService<T, ID, R extends JpaRepository<T, ID>> implements CrudService<T, ID> {

    protected final R repository;

    @Override
    public List<T> findAll() {
        return repository.findAll();
    }

    @Override
    public T create(@NonNull T entity) {
        return repository.save(entity);
    }

    @Override
    public T findOne(@NonNull ID id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Override
    public T update(@NonNull T entity) {
        return repository.save(entity);
    }

    @Override
    public void delete(@NonNull ID id) {
        repository.deleteById(id);
    }

}
