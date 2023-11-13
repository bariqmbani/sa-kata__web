export default function NextIcon(
  props: React.SVGProps<SVGSVGElement> & { size?: number } = {
    size: 40,
    className: ''
  }
) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={props.size}
      height={props.size}
      {...props}
    >
      <path
        d="M6 4h2v2h2v2h2v2h2v4h-2v2h-2v2H8v2H6V4zm12 0h-2v16h2V4z"
        fill="currentColor"
      />
    </svg>
  );
}
