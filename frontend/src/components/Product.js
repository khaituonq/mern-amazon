import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <div style={{ overflow: "hidden" }}>
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
            style={{ width: "100%", height: "380px", objectFit: "cover" }}
          />
        </div>
      </Link>
      <Card.Body
        style={{
          height: "175px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Link
          to={`/product/${product.slug}`}
          style={{ textDecoration: "none" }}
        >
          <Card.Title
            style={{
              color: "#0F1111",
              fontSize: "16px",
            }}
          >
            {product.name}
          </Card.Title>
        </Link>
        <Rating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>
          $<span style={{ fontWeight: "bold" }}>{product.price}</span>
        </Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Out of Stock
          </Button>
        ) : (
          <Button
            onClick={() => addToCartHandler(product)}
            style={{
              backgroundColor: "#E67A00",
              color: "#fff",
              border: "none",
              fontSize: "14px",
            }}
          >
            Add to Cart
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default Product;
