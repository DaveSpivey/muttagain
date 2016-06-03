class CreatePhotos < ActiveRecord::Migration
  def change
    create_table :photos do |t|
      t.references :mutt
      t.boolean :profile, default: false

      t.timestamps null: false
    end
  end
end
