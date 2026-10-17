package gadgethub.backend.repostories;

import gadgethub.backend.exceptions.NoSuchUserException;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Map;

@Repository
public class AuthorisationRepository {
    private final DataSource dataSource;

    public AuthorisationRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Map.Entry<Long, String> getPassword(String login) throws NoSuchUserException, SQLException {
        String sql = """
            SELECT id, password FROM authorisation
            WHERE login = (?)
        """;

        Connection connection = DataSourceUtils.getConnection(dataSource);
        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setString(1, login);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                if  (!resultSet.next()) {
                    throw new NoSuchUserException("No such authorisation data");
                }
                return Map.entry(resultSet.getLong("id"), resultSet.getString("password"));
            }
        } finally {
            DataSourceUtils.releaseConnection(connection, dataSource);
        }
    }
}
