import React, { Component, createContext } from 'react';

// Helper functions

function move(array: any[], oldIndex: any, newIndex: number) {
  if (newIndex >= array.length) {
    newIndex = array.length - 1;
  }
  array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
  return array;
}

function moveElement(array: any, index: any, offset: number) {
  const newIndex = index + offset;

  return move(array, index, newIndex);
}

// Context

const GridContext = createContext({ items: [] });
interface Props {
  listUrl: any[];
  setTempListPhoto(list: string[]): void;
}
interface State {
  items: any;
  moveItem: any;
  setItems: any;
}
export class GridProvider extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { listUrl } = props;
    this.state = {
      items: [...listUrl],
      moveItem: this.moveItem,
      setItems: this.setItems,
    };
  }

  componentDidUpdate(prevProps: any) {
    const { listUrl } = this.props;
    if (listUrl && prevProps.listUrl !== listUrl) {
      this.setState({ items: [...listUrl] });
    }
  }

  setItems = (items: any) => this.setState({ items });

  moveItem = (sourceId: any, destinationId: any) => {
    const { setTempListPhoto } = this.props;
    const { items } = this.state;

    const sourceIndex = items.findIndex((item: any) => item.createdAt === sourceId);
    const destinationIndex = items.findIndex((item: any) => item.createdAt === destinationId);

    // If source/destination is unknown, do nothing.
    if (sourceId === -1 || destinationId === -1) {
      return;
    }

    const offset = destinationIndex - sourceIndex;
    const temp = moveElement(this.state.items, sourceIndex, offset);

    this.setState(() => ({
      items: temp,
    }));

    setTempListPhoto(temp);
  };

  render() {
    return <GridContext.Provider value={this.state}>{this.props.children}</GridContext.Provider>;
  }
}

export default GridContext;
