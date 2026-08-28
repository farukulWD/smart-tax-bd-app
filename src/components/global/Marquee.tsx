import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';

interface MeasureElementProps {
  onLayout: (width: number) => void;
  children: React.ReactNode;
}

const MeasureElement: React.FC<MeasureElementProps> = ({ onLayout, children }) => (
  <Animated.ScrollView horizontal style={marqueeStyles.hidden} pointerEvents="box-none">
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>{children}</View>
  </Animated.ScrollView>
);

interface TranslatedElementProps {
  index: number;
  children: React.ReactNode;
  offset: SharedValue<number>;
  childrenWidth: number;
}

const TranslatedElement: React.FC<TranslatedElementProps> = ({
  index,
  children,
  offset,
  childrenWidth,
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    left: (index - 1) * childrenWidth,
    transform: [{ translateX: -offset.value }],
  }));

  return (
    <Animated.View style={[marqueeStyles.animatedElement, animatedStyle]}>{children}</Animated.View>
  );
};

const getIndicesArray = (length: number): number[] => Array.from({ length }, (_, i) => i);

interface ClonerProps {
  count: number;
  renderChild: (index: number) => React.ReactNode;
}

const Cloner: React.FC<ClonerProps> = ({ count, renderChild }) => (
  <>{getIndicesArray(count).map(renderChild)}</>
);

interface ChildrenScrollerProps {
  speed: number;
  childrenWidth: number;
  parentWidth: number;
  children: React.ReactNode;
}

const ChildrenScroller: React.FC<ChildrenScrollerProps> = ({
  speed,
  childrenWidth,
  parentWidth,
  children,
}) => {
  const offset = useSharedValue(0);

  useFrameCallback((frameInfo) => {
    const delta = (frameInfo.timeSincePreviousFrame ?? 16) * speed;
    offset.value = (offset.value + delta) % childrenWidth;
  }, true);

  const count = Math.round(parentWidth / childrenWidth) + 2;

  const renderChild = (index: number) => (
    <TranslatedElement
      key={`clone-${index}`}
      index={index}
      offset={offset}
      childrenWidth={childrenWidth}>
      {children}
    </TranslatedElement>
  );

  return <Cloner count={count} renderChild={renderChild} />;
};

interface MarqueeProps {
  speed?: number;
  children: React.ReactNode;
  style?: any;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ speed = 50, children, style, className }) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  const pxPerMs = speed / 1000;

  return (
    <View
      className={className}
      style={style}
      onLayout={(ev) => setParentWidth(ev.nativeEvent.layout.width)}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller speed={pxPerMs} parentWidth={parentWidth} childrenWidth={childrenWidth}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

const marqueeStyles = StyleSheet.create({
  hidden: {
    opacity: 0,
    zIndex: -1,
  },
  row: {
    flexDirection: 'row',
    overflow: 'hidden',
  },
  animatedElement: {
    position: 'absolute',
  },
});

export default Marquee;
