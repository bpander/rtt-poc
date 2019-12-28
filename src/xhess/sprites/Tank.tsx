import React from 'react';
import { EntityComponentProps } from 'engine/models/Entity';
import { useRootState } from 'root';
import { useDispatch } from 'react-redux';
import { updateXhess } from 'xhess/duck';
import { removeFirst } from 'util/arrays';

export const Tank: React.FC<EntityComponentProps> = ({ facet, entity }) => {
  const dispatch = useDispatch();
  const { xhess, engine } = useRootState();
  const isSelected = xhess.selected.includes(entity.id);

  return (
    <ellipse
      cx={0}
      cy={0}
      rx={facet.size[0] / 2}
      ry={facet.size[1] / 2}
      fill="blue"
      stroke={isSelected ? 'black' : 'none'}
      strokeWidth={3 / engine.camera.scale}
      onClick={() => {
        dispatch(updateXhess({
          selected: isSelected
            ? removeFirst(xhess.selected, entity.id)
            : [ ...xhess.selected, entity.id ],
        }));
      }}
    />
  );
};
