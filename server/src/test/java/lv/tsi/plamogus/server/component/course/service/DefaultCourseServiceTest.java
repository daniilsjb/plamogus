package lv.tsi.plamogus.server.component.course.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;
import java.util.function.Supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DefaultCourseServiceTest {

    @Mock
    private CourseRepository repository;

    @Mock
    private Supplier<UUID> uuidSupplier;

    @InjectMocks
    private DefaultCourseService victim;

    @Test
    @DisplayName("Should successfully create a course")
    public void scenario_635165376f77471eaaaa29d008e5eef8() {
        final var entity = Course.builder()
            .code("CS101")
            .title("Computer Science")
            .build();

        final var id = UUID.fromString("0efa57ad-93e6-4bde-bf06-67e97a970281");

        when(repository.findByCode("CS101")).thenReturn(Optional.empty());
        when(uuidSupplier.get()).thenReturn(id);

        victim.create(entity);

        assertThat(entity.getId()).isEqualTo(id);

        verify(uuidSupplier).get();
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when trying to create a course with a duplicate code")
    public void scenario_d16a0af771844fdb8e0022988f0bae91() {
        final var entity = Course.builder()
            .code("CS101")
            .title("Computer Science Course Project")
            .build();

        final var other = Course.builder()
            .code("CS101")
            .title("Introduction to Computer Science")
            .build();

        when(repository.findByCode("CS101")).thenReturn(Optional.of(other));

        assertThatThrownBy(() -> victim.create(entity))
            .isInstanceOf(ResponseStatusException.class);

        verify(uuidSupplier, never()).get();
        verify(repository, never()).save(entity);
    }

    @Test
    @DisplayName("Should successfully update a course")
    public void scenario_644736656dc14f86a21036af8e0f66d9() {
        final var id = UUID.fromString("0efa57ad-93e6-4bde-bf06-67e97a970281");
        final var entity = Course.builder()
            .id(id)
            .code("CS101")
            .title("Computer Science")
            .build();

        when(repository.findByCode("CS101")).thenReturn(Optional.empty());

        victim.update(entity);

        assertThat(entity.getId()).isEqualTo(id);

        verify(uuidSupplier, never()).get();
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should throw an exception when trying to update a course to a duplicate code")
    public void scenario_e451aacc853449619c84b05f24517135() {
        final var entity = Course.builder()
            .id(UUID.fromString("0efa57ad-93e6-4bde-bf06-67e97a970281"))
            .code("CS101")
            .title("Computer Science Course Project")
            .build();

        final var other = Course.builder()
            .id(UUID.fromString("7a9ad2ff-61c3-4a7e-af96-5b6686ddce5e"))
            .code("CS101")
            .title("Introduction to Computer Science")
            .build();

        when(repository.findByCode("CS101")).thenReturn(Optional.of(other));

        assertThatThrownBy(() -> victim.update(entity))
            .isInstanceOf(ResponseStatusException.class);

        verify(uuidSupplier, never()).get();
        verify(repository, never()).save(entity);
    }

    @Test
    @DisplayName("Should successfully update a course when its code remains unchanged")
    public void scenario_78e6c2accf014793912974256b51cda8() {
        final var entity = Course.builder()
            .id(UUID.fromString("0efa57ad-93e6-4bde-bf06-67e97a970281"))
            .code("CS101")
            .title("Computer Science Course Project")
            .build();

        when(repository.findByCode("CS101")).thenReturn(Optional.of(entity));

        victim.update(entity);

        verify(uuidSupplier, never()).get();
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Calls to delete are propagated to the repository")
    public void scenario_0a88956b3d8b4960bd91e5ca24f23106() {
        final var id = UUID.fromString("4564a0b9-ddce-456f-a46b-22946413f1c3");

        victim.delete(id);

        verify(repository).deleteById(id);
    }

}
