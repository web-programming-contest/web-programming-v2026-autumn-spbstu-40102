package gadgethub.backend.exceptions;

import messenger.backend.exceptions.AppException;
import org.springframework.http.HttpStatus;

public class InvalidCredentials extends AppException {
    public InvalidCredentials(String message) {
        super("INVALID_CREDENTIALS", HttpStatus.UNAUTHORIZED, message);
    }
}
