package gadgethub.backend.dtos;

public record ErrorResponse(
        String error,
        String message,
        int status
) {}