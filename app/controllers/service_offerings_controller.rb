class ServiceOfferingsController < ApplicationController
  before_action :set_thing, only: :create
  before_action :set_service_offering, except: [:index, :create]
  before_action :authenticate_user!, only: [:create, :update, :destroy]

	def index
		#authorize @thing, :get_images?
		p params
		if params[:thing_id]
			@service_offerings = ServiceOffering.of_thing(params.fetch(:thing_id))
		else
			@service_offerings = ServiceOffering.all
		end
	end

	def create
		service = ServiceOffering.new(service_offering_params)
		if service.save
			@thing.service_offerings << service
		end
	end

	def update
		@service_offering.update_attributes(service_offering_params)
	end

	def destroy
		@service_offering.destroy
	end

  def linkable_things
	  # authorize Thing, :get_linkables?
	  service_offering = Image.find(params[:service_offerings_id])
	  @things=Thing.not_linked_se(service_offering)
	  # @things=ThingPolicy::Scope.new(current_user,@things).user_roles(true,false)
	  # @things=ThingPolicy.merge(@things)
	  render "things/index"
  end

  private

	def set_thing
		@thing = Thing.find_by_id(params[:thing_id])
	end

	def set_service_offering
		@service_offering = ServiceOffering.find_by_id(params[:id])
	end

	def service_offering_params
		params.require(:service_offering).tap {|p|
			p.require(:name) #throws ActionController::ParameterMissing
		}.permit(:name, :description)
	end
end