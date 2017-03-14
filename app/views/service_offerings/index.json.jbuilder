json.array!(@service_offerings) do |si|
	json.extract! si, :id, :thing_id, :name, :description, :created_at, :updated_at
	json.thing_name si.thing.name if si.thing.respond_to?(:name)
	json
end
