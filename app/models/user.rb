class User < ActiveRecord::Base
  has_many :mutts, foreign_key: :owner_id

  has_secure_password
end
