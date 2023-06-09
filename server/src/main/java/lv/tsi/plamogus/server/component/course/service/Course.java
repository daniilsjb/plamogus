package lv.tsi.plamogus.server.component.course.service;

import jakarta.persistence.*;
import lombok.*;
import lv.tsi.plamogus.server.component.assignment.service.Assignment;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    private UUID id;

    @Column(nullable = false, length = 8, unique = true)
    private String code;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(length = 1024)
    private String description;

    @Column
    private Integer semester;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Assignment> assignments;

    public Course(UUID id) {
        this.id = id;
    }

}
