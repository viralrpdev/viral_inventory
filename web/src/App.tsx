import InventoryComponent from './components/inventory';
import useNuiEvent from './hooks/useNuiEvent';
import { Items } from './store/items';
import { Locale } from './store/locale';
import { setImagePath } from './store/imagepath';
import { setupInventory } from './store/inventory';
import { Inventory } from './typings';
import { useAppDispatch } from './store';
import { debugData } from './utils/debugData';
import DragPreview from './components/utils/DragPreview';
import { fetchNui } from './utils/fetchNui';
import { useDragDropManager } from 'react-dnd';
import KeyPress from './components/utils/KeyPress';

debugData([
  {
    action: 'setupInventory',
    data: {
      leftInventory: {
        id: 'test',
        type: 'player',
        slots: 20,
        label: 'Bob Smith',
        weight: 3000,
        maxWeight: 5000,
        items: [
          {
            slot: 1,
            name: 'water',
            weight: 200,
            count: 1,
            metadata: { description: 'Generic item description', durability: 50 },
          },
          {
            slot: 2,
            name: 'water',
            weight: 200,
            count: 1,
            metadata: { description: 'Generic item description' },
          },
          { slot: 4, name: 'water', weight: 100, count: 1, metadata: { description: 'Generic item description' } },
          { slot: 5, name: 'water', weight: 100, count: 1 },
          { slot: 4, name: 'water', weight: 100, count: 1, metadata: { description: 'Generic item description' } },
        ],
      },
      rightInventory: {
        id: 'drop',
        type: 'drop',
        slots: 15,
        label: 'Other eq',
        weight: 2,
        maxWeight: 5000,
        items: [{ slot: 5, name: 'water', weight: 100, count: 1, price: '300' }],
      },
    },
  },
]);

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const manager = useDragDropManager();

  useNuiEvent<{
    locale: { [key: string]: string };
    items: typeof Items;
    leftInventory: Inventory;
    imagepath: string;
  }>('init', ({ locale, items, leftInventory, imagepath }) => {
    for (const name in locale) Locale[name] = locale[name];
    for (const name in items) Items[name] = items[name];

    setImagePath(imagepath);
    dispatch(setupInventory({ leftInventory }));
  });

  fetchNui('uiLoaded', {});

  useNuiEvent('closeInventory', () => {
    manager.dispatch({ type: 'dnd-core/END_DRAG' });
  });

  return (
    <div className="app-wrapper">
      <InventoryComponent />
      <DragPreview />
      <KeyPress />
    </div>
  );
};

addEventListener('dragstart', function (event) {
  event.preventDefault();
});

export default App;
