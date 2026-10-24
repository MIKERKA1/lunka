// Phosphor icons, read as raw SVG at build time. Rendered once per page as a sprite (IconSprite.astro)
// and referenced with <use>, so repeated icons cost one copy of each path.
import arrowCounterClockwise from '@phosphor-icons/core/assets/regular/arrow-counter-clockwise.svg?raw';
import calendarBlank from '@phosphor-icons/core/assets/regular/calendar-blank.svg?raw';
import caretDown from '@phosphor-icons/core/assets/regular/caret-down.svg?raw';
import caretLeft from '@phosphor-icons/core/assets/regular/caret-left.svg?raw';
import caretRight from '@phosphor-icons/core/assets/regular/caret-right.svg?raw';
import check from '@phosphor-icons/core/assets/regular/check.svg?raw';
import checkCircle from '@phosphor-icons/core/assets/regular/check-circle.svg?raw';
import clock from '@phosphor-icons/core/assets/regular/clock.svg?raw';
import info from '@phosphor-icons/core/assets/regular/info.svg?raw';
import list from '@phosphor-icons/core/assets/regular/list.svg?raw';
import mapPin from '@phosphor-icons/core/assets/regular/map-pin.svg?raw';
import phone from '@phosphor-icons/core/assets/regular/phone.svg?raw';
import x from '@phosphor-icons/core/assets/regular/x.svg?raw';

export const icons = {
  'arrow-counter-clockwise': arrowCounterClockwise,
  'calendar-blank': calendarBlank,
  'caret-down': caretDown,
  'caret-left': caretLeft,
  'caret-right': caretRight,
  'check': check,
  'check-circle': checkCircle,
  'clock': clock,
  'info': info,
  'list': list,
  'map-pin': mapPin,
  'phone': phone,
  'x': x,
};

export type IconName = keyof typeof icons;

/** The paths inside a Phosphor file, without its outer <svg> element. */
export const iconBody = (name: IconName): string => icons[name].replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
