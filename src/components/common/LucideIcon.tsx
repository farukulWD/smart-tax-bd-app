import * as Icons from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { memo, useMemo } from 'react';

type IconName = keyof typeof Icons;
type IconProps = React.ComponentProps<typeof Icons.AlertCircle> & {
  name: IconName;
  className?: string;
};

const LucideIcon: React.FC<IconProps> = memo(({ name, className, ...props }: IconProps) => {
  const CustomIcon = useMemo(() => {
    const Icon = Icons[name as keyof typeof Icons] as React.ComponentType<any>;
    if (!Icon) return null;
    Icon.displayName = name;

    return cssInterop(Icon, {
      className: {
        target: 'style',
        nativeStyleToProp: {
          color: true,
          width: true,
          height: true,
        },
      },
    });
  }, [name]);

  return CustomIcon ? <CustomIcon className={className} {...props} /> : null;
});

LucideIcon.displayName = 'Icon';

export default LucideIcon;
