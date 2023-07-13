import ItemShow from './ItemShow';

function ItemList({ items }) {
  const renderedItems = items.map((item) => {
    return (
        <ItemShow key={item.id} item={item} />
    )
  });

  return <div className="image-list">{renderedItems}</div>;
}

export default ItemList;
