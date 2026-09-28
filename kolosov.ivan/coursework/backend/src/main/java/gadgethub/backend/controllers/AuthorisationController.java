package gadgethub.backend.controllers;

import gadgethub.backend.dtos.LoginRequest;
import gadgethub.backend.service.AuthorisationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthorisationController {
    private final AuthorisationService authorisationService;

    public AuthorisationController(AuthorisationService authorisationService) { this.authorisationService = authorisationService; }

    @PostMapping("/login")
    public Long postCheckCredentials(@RequestBody LoginRequest request) {
        return authorisationService.checkCredentials(request.login(), request.password());
    }
}
