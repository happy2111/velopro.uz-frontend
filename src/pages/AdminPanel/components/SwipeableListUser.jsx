import React from "react";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type as ListType,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import Button from "../../../components/Button.jsx";
import {Info} from "lucide-react";

export default function SwipeableListUser({items, removeProduct}) {

  const trailingActions = (id) => (
    <TrailingActions>
      <SwipeAction destructive={true}
                   onClick={() => {
                    removeProduct(id);
      }}>
        <p className={"px-2 cursor-pointer bg-red-600 flex justify-center items-center h-full  text-white"}>
          Удалить
        </p>
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList type={ListType.IOS} fullSwipe={true}>
      {items.map((item, index) => (
        <SwipeableListItem key={index} trailingActions={trailingActions(item._id)} >
          <div className="w-full px-6 py-4 whitespace-nowrap border-dark-25 border-b-2 flex items-center justify-between">
            <div className="ml-1 flex gap-2 items-center">

              <div className="h-12  w-12 overflow-hidden   rounded-xl text-sm font-medium text-gray-95">
                <img
                  className={"object-cover w-full h-full"}
                  src={`${import.meta.env.VITE_API_BASE_URL}${item?.images[0]}`}
                  alt=""
                  width=""
                  height=""
                  loading="lazy"
                />
              </div>

              <div className=" md:hidden ">
                <div className="text-sm font-medium text-gray-50">{item.title}</div>
                <div className="text-sm font-medium text-gray-95">{item.price} so'm
                  <span className="text-base text-gray-50">(x{item.stock} ta)</span>
                </div>
              </div>



            </div>
            <Button
              isTransparent={false}
              CustomIcon={Info}
              className="!bg-transparent !text-sky-600 scale-140"
            />
          </div>
        </SwipeableListItem>
      ))}
    </SwipeableList>
  );
}
