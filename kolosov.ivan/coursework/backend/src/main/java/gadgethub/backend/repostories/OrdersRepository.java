package gadgethub.backend.repostories;

import gadgethub.backend.dtos.NewOrder;
import gadgethub.backend.dtos.OrderSummary;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Repository
public class OrdersRepository {

    private final DataSource dataSource;

    public OrdersRepository(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public Long insertNewOrder(NewOrder newOrder)  throws SQLException{
        String sql = """
                INSERT INTO orders (client_id, products, products_amount, total_price, email, phone, address, is_cash, is_packaging_required)
                VALUES (?, ?::json, ?, ?, ?, ?, ?, ?, ?)
                RETURNING id;
                """;
        Connection connection = DataSourceUtils.getConnection(dataSource);
        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            setNewOrderInPreparedStatement(newOrder, preparedStatement);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                resultSet.next();
                return resultSet.getLong("id");
            }
        } finally {
            DataSourceUtils.releaseConnection(connection, dataSource);
        }
    }

    private void setNewOrderInPreparedStatement(NewOrder newOrder, PreparedStatement preparedStatement) throws SQLException {
        preparedStatement.setLong(1, newOrder.clientId());
        preparedStatement.setString(2, newOrder.products());
        preparedStatement.setLong(3, newOrder.productsAmount());
        preparedStatement.setLong(4, newOrder.totalPrice());
        preparedStatement.setString(5, newOrder.email());
        preparedStatement.setString(6, newOrder.phone());
        preparedStatement.setString(7, newOrder.address());
        preparedStatement.setBoolean(8, newOrder.isCash());
        preparedStatement.setBoolean(9, newOrder.isPackagingRequired());
    }

    public List<OrderSummary> getOrderSummaryListForClient(Long clientId) throws SQLException{
        String sql = """
                SELECT id, products_amount, total_price, create_date FROM orders
                WHERE client_id = (?)
                ORDER BY create_date
                """;
        Connection connection = DataSourceUtils.getConnection(dataSource);
        try (PreparedStatement preparedStatement = connection.prepareStatement(sql)) {
            preparedStatement.setLong(1, clientId);

            try (ResultSet resultSet = preparedStatement.executeQuery()) {
                return mapResultSetToOrderSummaryList(resultSet);
            }
        } finally {
            DataSourceUtils.releaseConnection(connection, dataSource);
        }
    }

    private OrderSummary mapRowToOrderSummary(ResultSet resultSet) throws SQLException {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        String formatted = resultSet.getTimestamp("create_date").toLocalDateTime().format(formatter);
        return new OrderSummary(
                resultSet.getLong("id"),
                resultSet.getLong("products_amount"),
                resultSet.getLong("total_price"),
                formatted
        );
    }

    private List<OrderSummary> mapResultSetToOrderSummaryList(ResultSet resultSet) throws SQLException {
        List<OrderSummary> orderSummaryList = new ArrayList<>();

        while (resultSet.next()) {
            orderSummaryList.add(mapRowToOrderSummary(resultSet));
        }

        return orderSummaryList;
    }
}
