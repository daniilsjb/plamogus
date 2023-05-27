package lv.tsi.uap.server.component.assignment.service;

import jakarta.persistence.*;
import lombok.*;
import lv.tsi.uap.server.component.course.service.Course;
import lv.tsi.uap.server.component.step.service.Step;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Assignment {

    @Id
    private UUID id;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(length = 512)
    private String description;

    @Column(nullable = false)
    private Boolean completed = false;

    @Column(nullable = false, updatable = false)
    private Instant creationTime;

    @Column
    private Instant deadlineTime;

    @Enumerated(EnumType.ORDINAL)
    private AssignmentType type;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "assignment", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Step> steps;

    public Assignment(UUID id) {
        this.id = id;
    }

}
