import Svg, { G, Path, Rect, SvgProps } from 'react-native-svg';

type ArtProps = SvgProps & { size?: number };

export function PixelBrandMark({ size = 64, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <Rect x="5" y="18" width="24" height="32" fill="#8E622A" />
      <Rect x="35" y="18" width="24" height="32" fill="#8E622A" />
      <Rect x="9" y="14" width="20" height="32" fill="#FFF1C8" />
      <Rect x="35" y="14" width="20" height="32" fill="#FFF1C8" />
      <Rect x="13" y="18" width="16" height="24" fill="#F2E5C5" />
      <Rect x="35" y="18" width="16" height="24" fill="#F2E5C5" />
      <Rect x="29" y="14" width="6" height="38" fill="#6E3032" />
      <Rect x="21" y="23" width="5" height="15" fill="#E7B85C" />
      <Rect x="38" y="23" width="5" height="15" fill="#E7B85C" />
      <Rect x="9" y="46" width="20" height="5" fill="#D7C49D" />
      <Rect x="35" y="46" width="20" height="5" fill="#D7C49D" />
      <Rect x="27" y="6" width="10" height="5" fill="#FFD77A" />
      <Rect x="29" y="4" width="6" height="9" fill="#FFD77A" />
    </Svg>
  );
}

export function PixelBible({ size = 112, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 96 96" {...props}>
      <Rect x="10" y="18" width="70" height="62" fill="#5D342B" />
      <Rect x="6" y="22" width="8" height="54" fill="#2C1C1B" />
      <Rect x="14" y="14" width="64" height="8" fill="#B75C45" />
      <Rect x="14" y="22" width="62" height="50" fill="#943F37" />
      <Rect x="20" y="28" width="50" height="38" fill="#A94C49" />
      <Rect x="14" y="72" width="64" height="8" fill="#E8D39D" />
      <Rect x="20" y="72" width="50" height="4" fill="#FFF1C8" />
      <Rect x="78" y="24" width="8" height="50" fill="#6E3032" />
      <Rect x="42" y="30" width="8" height="30" fill="#E7B85C" />
      <Rect x="32" y="38" width="28" height="8" fill="#E7B85C" />
      <Rect x="38" y="34" width="4" height="4" fill="#FFD77A" />
      <Rect x="50" y="46" width="4" height="10" fill="#8E622A" />
      <Rect x="24" y="80" width="8" height="8" fill="#D39B40" />
      <Rect x="32" y="80" width="8" height="12" fill="#F1C66B" />
      <Rect x="40" y="80" width="8" height="8" fill="#D39B40" />
      <Rect x="22" y="12" width="8" height="4" fill="#FFD77A" opacity={0.65} />
    </Svg>
  );
}

export function PixelCandle({ size = 72, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <Rect x="28" y="5" width="8" height="8" fill="#FFD77A" />
      <Rect x="24" y="13" width="16" height="8" fill="#E7B85C" />
      <Rect x="28" y="9" width="8" height="8" fill="#FFF1B8" />
      <Rect x="20" y="21" width="24" height="34" fill="#D7C49D" />
      <Rect x="24" y="21" width="16" height="30" fill="#FFF3D0" />
      <Rect x="20" y="29" width="8" height="8" fill="#E9D8B1" />
      <Rect x="36" y="37" width="8" height="10" fill="#E9D8B1" />
      <Rect x="14" y="55" width="36" height="6" fill="#8E622A" />
      <Rect x="22" y="17" width="4" height="4" fill="#E7B85C" />
      <Rect x="40" y="13" width="4" height="4" fill="#FFD77A" />
    </Svg>
  );
}

export function PixelPrayer({ size = 72, color, ...props }: ArtProps & { color?: string }) {
  const sleeve = color ?? '#6E5AA6';
  const sleeveLight = color ?? '#8C79A8';
  const skin = color ?? '#E7B85C';
  const skinLight = color ?? '#FFD77A';
  const shadow = color ?? '#8E622A';

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <Rect x="4" y="46" width="20" height="12" fill={sleeve} />
      <Rect x="40" y="46" width="20" height="12" fill={sleeve} />
      <Rect x="10" y="40" width="16" height="12" fill={sleeveLight} />
      <Rect x="38" y="40" width="16" height="12" fill={sleeveLight} />
      <Rect x="18" y="32" width="10" height="16" fill={skin} />
      <Rect x="36" y="32" width="10" height="16" fill={skin} />
      <Rect x="22" y="22" width="9" height="20" fill={skinLight} />
      <Rect x="33" y="22" width="9" height="20" fill={skinLight} />
      <Rect x="27" y="10" width="10" height="30" fill={skinLight} />
      <Rect x="27" y="36" width="10" height="14" fill={skin} />
      <Rect x="22" y="28" width="5" height="10" fill={shadow} />
      <Rect x="37" y="28" width="5" height="10" fill={shadow} />
      <Rect x="29" y="6" width="6" height="6" fill={color ?? '#FFF1B8'} />
      <Rect x="10" y="58" width="16" height="4" fill={color ?? '#55466D'} />
      <Rect x="38" y="58" width="16" height="4" fill={color ?? '#55466D'} />
    </Svg>
  );
}

export function PixelShield({ size = 72, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <Path d="M8 8H56V36H52V44H44V52H36V58H28V54H20V48H14V40H8V8Z" fill="#263A55" />
      <Path d="M14 14H50V34H46V42H38V48H32V52H28V48H22V42H18V34H14V14Z" fill="#668DB2" />
      <Rect x="28" y="16" width="8" height="32" fill="#E7B85C" />
      <Rect x="18" y="26" width="28" height="8" fill="#E7B85C" />
      <Rect x="18" y="14" width="8" height="8" fill="#8DB1D0" />
      <Rect x="38" y="38" width="6" height="6" fill="#354F70" />
    </Svg>
  );
}

export function PixelHeart({ size = 72, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <Rect x="10" y="16" width="18" height="8" fill="#6E3032" />
      <Rect x="36" y="16" width="18" height="8" fill="#6E3032" />
      <Rect x="6" y="24" width="52" height="16" fill="#A94C49" />
      <Rect x="12" y="40" width="40" height="8" fill="#A94C49" />
      <Rect x="20" y="48" width="24" height="8" fill="#A94C49" />
      <Rect x="28" y="56" width="8" height="6" fill="#A94C49" />
      <Rect x="14" y="20" width="10" height="8" fill="#D97B6E" />
      <Rect x="20" y="28" width="8" height="8" fill="#C9635B" />
      <Rect x="6" y="32" width="6" height="8" fill="#6E3032" />
      <Rect x="52" y="32" width="6" height="8" fill="#6E3032" />
    </Svg>
  );
}

export function PixelScroll({ size = 72, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <Rect x="12" y="8" width="40" height="8" fill="#8E622A" />
      <Rect x="16" y="12" width="32" height="40" fill="#F2E5C5" />
      <Rect x="20" y="18" width="24" height="4" fill="#A94C49" />
      <Rect x="22" y="28" width="20" height="3" fill="#8E7D64" />
      <Rect x="22" y="35" width="16" height="3" fill="#8E7D64" />
      <Rect x="22" y="42" width="20" height="3" fill="#8E7D64" />
      <Rect x="8" y="48" width="44" height="8" fill="#D6A24A" />
      <Rect x="12" y="52" width="36" height="6" fill="#E7B85C" />
      <Rect x="48" y="12" width="6" height="38" fill="#6F4B24" />
    </Svg>
  );
}

export function PixelBookmark({ size = 26, color = '#E7B85C', filled = false, ...props }: ArtProps & { filled?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Path
        d="M5 2H19V22L12 17L5 22V2ZM8 5V16L12 13L16 16V5H8Z"
        fill={color}
        fillRule="evenodd"
      />
      {filled ? <Rect x="8" y="5" width="8" height="10" fill={color} /> : null}
    </Svg>
  );
}

export type NavIconName = 'home' | 'bible' | 'prayer' | 'saved' | 'credits' | 'search' | 'spark';

export function PixelNavIcon({
  name,
  size = 26,
  color = '#AAB0C0',
  filled = false,
  ...props
}: ArtProps & { name: NavIconName; filled?: boolean }) {
  const muted = filled ? color : 'none';

  if (name === 'home') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
        <Path d="M2 11H5V8H8V5H11V2H13V5H16V8H19V11H22V14H19V22H5V14H2V11Z" fill={color} />
        <Rect x="9" y="15" width="6" height="7" fill={filled ? '#10131D' : color} />
      </Svg>
    );
  }

  if (name === 'bible') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
        <Rect x="3" y="3" width="17" height="18" fill={muted} stroke={color} strokeWidth="2" />
        <Rect x="7" y="7" width="9" height="2" fill={color} />
        <Rect x="10" y="5" width="3" height="9" fill={color} />
        <Rect x="20" y="6" width="2" height="16" fill={color} />
      </Svg>
    );
  }

  if (name === 'prayer') {
    return <PixelPrayer size={size} color={String(color)} {...props} />;
  }

  if (name === 'saved') {
    return <PixelBookmark size={size} color={color} filled={filled} {...props} />;
  }

  if (name === 'credits') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
        <Rect x="8" y="2" width="8" height="7" fill={color} />
        <Rect x="5" y="9" width="14" height="3" fill={color} />
        <Rect x="3" y="12" width="18" height="9" fill={filled ? color : 'none'} stroke={color} strokeWidth="2" />
        <Rect x="10" y="13" width="4" height="9" fill={filled ? '#10131D' : color} />
        <Rect x="7" y="16" width="10" height="3" fill={filled ? '#10131D' : color} />
      </Svg>
    );
  }

  if (name === 'search') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
        <Rect x="4" y="4" width="11" height="3" fill={color} />
        <Rect x="4" y="7" width="3" height="8" fill={color} />
        <Rect x="13" y="7" width="3" height="8" fill={color} />
        <Rect x="7" y="14" width="8" height="3" fill={color} />
        <Rect x="16" y="16" width="3" height="3" fill={color} />
        <Rect x="19" y="19" width="3" height="3" fill={color} />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" {...props}>
      <Rect x="10" y="2" width="4" height="20" fill={color} />
      <Rect x="2" y="10" width="20" height="4" fill={color} />
      <Rect x="6" y="6" width="12" height="12" fill={color} opacity={0.35} />
    </Svg>
  );
}

export function PixelSparkles({ size = 64, color = '#E7B85C', ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" {...props}>
      <G fill={color}>
        <Rect x="28" y="4" width="8" height="24" />
        <Rect x="20" y="12" width="24" height="8" />
        <Rect x="48" y="34" width="4" height="16" />
        <Rect x="42" y="40" width="16" height="4" />
        <Rect x="8" y="42" width="4" height="12" />
        <Rect x="4" y="46" width="12" height="4" />
      </G>
    </Svg>
  );
}

export function PixelFlame({ size = 88, ...props }: ArtProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 72 88" {...props}>
      <Rect x="32" y="4" width="12" height="12" fill="#FFD77A" />
      <Rect x="24" y="12" width="28" height="16" fill="#FF9F43" />
      <Rect x="16" y="24" width="44" height="16" fill="#F06A32" />
      <Rect x="8" y="36" width="56" height="28" fill="#E84B2E" />
      <Rect x="14" y="60" width="44" height="12" fill="#B9362A" />
      <Rect x="22" y="72" width="28" height="8" fill="#7D2928" />
      <Rect x="28" y="34" width="20" height="16" fill="#FFD77A" />
      <Rect x="22" y="48" width="32" height="16" fill="#FFB43F" />
      <Rect x="28" y="64" width="20" height="8" fill="#F07A32" />
      <Rect x="8" y="44" width="8" height="12" fill="#B9362A" />
      <Rect x="56" y="32" width="8" height="16" fill="#B9362A" />
      <Rect x="16" y="28" width="8" height="8" fill="#FF9F43" />
    </Svg>
  );
}
