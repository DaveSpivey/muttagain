class AddPicToBreeds < ActiveRecord::Migration[5.1]
  def change
    add_column :breeds, :pic, :string
  end
end
