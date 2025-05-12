// DynamicElement.jsx
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DynamicElement',
  props: {
    // Accepts either a string (HTML tag name or "Link") or a component
    as: {
      type: [String, Object],
      default: 'button',
    },
  },
  setup(props, { slots, attrs }) {
    // Determine which component or tag to render.
    // If props.as is the string "Link", use Inertia's Link component.
    const Tag = props.as

    return () => (
      <Tag
        class="border-2 min-w-4 px-1 border-outset active:border-inset bg-gray-200 active:bg-gray-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
        {...attrs} // Spread any additional attributes, such as href, onClick, etc.
      >
        {slots.default && slots.default()}
      </Tag>
    )
  },
})
