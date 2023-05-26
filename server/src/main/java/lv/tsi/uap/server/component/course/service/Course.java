package lv.tsi.uap.server.component.course.service;

import jakarta.persistence.*;
import lombok.*;
import lv.tsi.uap.server.component.assignment.service.Assignment;
import lv.tsi.uap.server.component.user.service.User;

import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Course {

    @Id
    private UUID id;

    @Column(nullable = false, length = 8)
    private String code;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(length = 1024)
    private String description;

    @Column
    private Integer semester;

    @OneToMany(mappedBy = "course", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Assignment> assignments;

    @ManyToOne
    @JoinColumn(name = "_user_id", nullable = false)
    private User profile;

    public Course(UUID id) {
        this.id = id;
    }

}
