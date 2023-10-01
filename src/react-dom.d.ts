declare module "react-dom" {
  interface Root {
    render: (children: React.ReactNode) => void;
    unmount: () => void;
  }

  interface ReactDOM {
    createRoot: (
      container: Element | Document | DocumentFragment | Comment,
      options?: any
    ) => Root;
  }

  const ReactDOM: ReactDOM;
}
