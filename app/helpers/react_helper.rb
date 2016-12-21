module ReactHelper
  def react_component(
    name,
    props: {},
    div_options: {},
    &block
  )

    html_tag = div_options.delete(:tag) || :div
    content_tag(
      html_tag,
      nil,
      div_options.merge(data: { react_class: name, react_props: props }),
      &block
    )
  end
end