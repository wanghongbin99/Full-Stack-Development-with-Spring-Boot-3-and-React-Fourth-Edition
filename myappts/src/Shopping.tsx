import { useState } from "react";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import { ListItem } from "@mui/material";
import ListItemText from "@mui/material/ListItemText";
import AddItem from "./AddItem";

export type Item = {
  product: string;
  amount: string;
};
export type ShoppingList = {
  items: Item[];
};
function Shopping() {
  const [items, setItems] = useState<Item[]>([]);
  const addItem = (item: Item) => {
    setItems([item, ...items]);
  };
  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Shopping List</Typography>
        </Toolbar>
      </AppBar>
      <AddItem addItem={addItem} />
      <List>
        {items.map((item, index) => (
          <ListItem key={index} divider>
            <ListItemText primary={item.product} secondary={item.amount} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
}

export default Shopping;
