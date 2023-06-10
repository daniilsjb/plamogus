package lv.tsi.plamogus.server.component.dashboard.endpoint;

import lombok.RequiredArgsConstructor;
import lv.tsi.plamogus.server.component.dashboard.service.DashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/dashboard")
class DashboardController {

    private final DashboardService service;

    @GetMapping
    public DashboardResponse index() {
        return service.index();
    }

}
