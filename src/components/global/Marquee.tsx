import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useFrameCallback,
  useSharedValue,
  SharedValue,
} from 'react-native-reanimated';

// ─── MeasureElement ───────────────────────────────────────────────────────────
interface MeasureElementProps {
  onLayout: (width: number) => void;
  children: React.ReactNode;
}

const MeasureElement: React.FC<MeasureElementProps> = ({ onLayout, children }) => (
  <Animated.ScrollView horizontal style={marqueeStyles.hidden} pointerEvents="box-none">
    <View onLayout={(ev) => onLayout(ev.nativeEvent.layout.width)}>{children}</View>
  </Animated.ScrollView>
);

// ─── TranslatedElement ────────────────────────────────────────────────────────
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

// ─── Cloner ───────────────────────────────────────────────────────────────────
const getIndicesArray = (length: number): number[] => Array.from({ length }, (_, i) => i);

interface ClonerProps {
  count: number;
  renderChild: (index: number) => React.ReactNode;
}

const Cloner: React.FC<ClonerProps> = ({ count, renderChild }) => (
  <>{getIndicesArray(count).map(renderChild)}</>
);

// ─── ChildrenScroller ─────────────────────────────────────────────────────────
interface ChildrenScrollerProps {
  /** Pixels per millisecond */
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

  // Constant pixel-per-ms speed — independent of content width
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

// ─── Marquee (public API) ─────────────────────────────────────────────────────
interface MarqueeProps {
  /**
   * Scroll speed in pixels per second.
   * Constant regardless of content length — short or long text moves at the same pace.
   * @default 50
   */
  speed?: number;
  children: React.ReactNode;
  style?: any;
  className?: string;
}

const Marquee: React.FC<MarqueeProps> = ({ speed = 50, children, style, className }) => {
  const [parentWidth, setParentWidth] = React.useState(0);
  const [childrenWidth, setChildrenWidth] = React.useState(0);

  // Convert px/s → px/ms for frame callback
  const pxPerMs = speed / 1000;

  return (
    <View
      className={className}
      style={style}
      onLayout={(ev) => setParentWidth(ev.nativeEvent.layout.width)}
      pointerEvents="box-none">
      <View style={marqueeStyles.row} pointerEvents="box-none">
        {/* Invisible measurement pass */}
        <MeasureElement onLayout={setChildrenWidth}>{children}</MeasureElement>

        {/* Render only after both widths are known */}
        {childrenWidth > 0 && parentWidth > 0 && (
          <ChildrenScroller speed={pxPerMs} parentWidth={parentWidth} childrenWidth={childrenWidth}>
            {children}
          </ChildrenScroller>
        )}
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
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

// ─── Usage example ────────────────────────────────────────────────────────────
// <Marquee speed={60}>
//   <Text>Short text</Text>
// </Marquee>
//
// <Marquee speed={60}>
//   <Text>A very very long piece of text that scrolls at the exact same speed</Text>
// </Marquee>
//
// <Marquee speed={80} style={{ backgroundColor: '#000', paddingVertical: 8 }}>
//   <Text style={{ color: '#fff' }}>Custom styled marquee</Text>
// </Marquee>
