class Photo < ActiveRecord::Base
  belongs_to :mutt

  has_attached_file :image,
                    :styles => {
                      :thumb => "100x100#",
                      :small  => "150x150>",
                      :medium => "200x200",
                      :large => "500x500" }

  validates_attachment :image,
                       content_type: { content_type: ["image/jpeg", "image/gif", "image/png"] }
end